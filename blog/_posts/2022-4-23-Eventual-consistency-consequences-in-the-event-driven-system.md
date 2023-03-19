---
date: 2022-4-23
tag: 
  - distributed system
  - event driven
  - consistancy
author: Mohamed Ragab
location: Egypt 
---

# Eventual consistency consequences in the event-driven distributed system

In this article, I will explain the consequences of applying eventual consistency in event-based systems.

we will discuss the following points

- Consistency means in a different context synchronous and asynchronous systems
- Eventual consistency consequences problems ( timeline and collisions)
- conflict-free replicated data type
- Single writer pattern

### Consistency

The consistency concept is widely used in our industry with different meanings, for example, the traditional systems that implement single-threaded-writing and apply the database transaction stuff with the ACID property so the user can read the most recently written value in a strong consistency model can be done safely in a traditional three-tier program (Client, server and database) but what if the crews of services that run independently and communicate asynchronously like in microservices architecture, the data as long as it moves from service to another will often become visible to the user at different times unless we use a single global state but in real-world distributed systems where the applications are distributed across geographies and networks it is a bad thing to implement a single global state that limits the scalability.

As we see this is a direct model as everything processes sequentially through RPC notification with a single global state it is a simple and good approach but it is not scalable as it is hard when we add new services or need to scale existing services.

Event-driven based systems that run at scale are not built in this approach, Instead, they force asynchronous broadcasts that remove the necessity of a global state with another kind of consistency called eventual consistency as the services communicate through different networks and clocks asynchronously.


In this design, the services work independently so they can scale independently, let us explain a design, an order is accepted by the order service this is picked up by the validation service where it is validated, sales tax is added and an email is sent. The updated order goes back to the order service where it can be queried via the orders view this is an implementation of CQRS (command query responsibility segregation pattern) you can check my previous article I explained the query problem in more detail