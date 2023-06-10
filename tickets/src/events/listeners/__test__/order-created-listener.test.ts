import mongoose, { set } from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import {
  OrderCreatedEvent,
  OrderStatus,
} from "@vikaskumarnegi/ticketing-common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //create a instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  //fake data object
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "asdasd",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};
it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});
it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdateData.orderId);
});
