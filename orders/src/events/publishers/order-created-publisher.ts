import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@vikaskumarnegi/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
