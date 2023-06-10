import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "12" });

  //save the ticket to database
  await ticket.save();
  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  //make two separate changes to tickets we have found
  firstInstance!.set({ price: 50 });
  secondInstance!.set({ price: 15 });
  //save the first fetched ticket
  await firstInstance!.save();
  //save the second fetched ticket and expect an error
  expect(async () => {
    await secondInstance!.save();
  });
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "12" });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
