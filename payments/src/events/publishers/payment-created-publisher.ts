import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@vikaskumarnegi/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
