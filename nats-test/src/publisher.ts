import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
import { Subjects } from "./events/subjects";

console.clear();
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  /* const data = JSON.stringify({
    id: 123,
    title: "Concert",
    price: 20,
  }); */
  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: "123",
    title: "concert",
    price: 20,
  });
  /* stan.publish("ticket:created", data, () => {
    console.log("event publish");
  }); */
});
