import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@vikaskumarnegi/ticketing-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
