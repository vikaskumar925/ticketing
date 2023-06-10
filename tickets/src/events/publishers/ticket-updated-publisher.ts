import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@vikaskumarnegi/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
