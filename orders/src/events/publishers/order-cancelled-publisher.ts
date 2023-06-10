import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@vikaskumarnegi/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
