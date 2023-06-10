import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@vikaskumarnegi/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
