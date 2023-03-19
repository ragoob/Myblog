---
date: 2022-4-23
tag: 
  - distributed system
  - event driven
  - consistancy
  - kafka
author: Mohamed Ragab
location: Egypt 
---

# Eventual consistency consequences in the event-driven distributed system

![Eventual consistancy](/eventual-consistancy.jpg)

In this article, I will explain the consequences of applying eventual consistency in event-based systems.

we will discuss the following points

- Consistency means in a different context synchronous and asynchronous systems
- Eventual consistency consequences problems ( timeline and collisions)
- conflict-free replicated data type
- Single writer pattern

### Consistency

The consistency concept is widely used in our industry with different meanings, for example, the traditional systems that implement single-threaded-writing and apply the database transaction stuff with the ACID property so the user can read the most recently written value in a strong consistency model can be done safely in a traditional three-tier program (Client, server and database) but what if the crews of services that run independently and communicate asynchronously like in microservices architecture, the data as long as it moves from service to another will often become visible to the user at different times unless we use a single global state but in real-world distributed systems where the applications are distributed across geographies and networks it is a bad thing to implement a single global state that limits the scalability.

![Eventual consistancy](/eventual-consistancy-2.jpg)


As we see this is a direct model as everything processes sequentially through RPC notification with a single global state it is a simple and good approach but it is not scalable as it is hard when we add new services or need to scale existing services.

Event-driven based systems that run at scale are not built in this approach, Instead, they force asynchronous broadcasts that remove the necessity of a global state with another kind of consistency called eventual consistency as the services communicate through different networks and clocks asynchronously.

![Eventual consistancy](/eventual-consistancy-3.jpg)


In this design, the services work independently so they can scale independently, let us explain a design, an order is accepted by the order service this is picked up by the validation service where it is validated, sales tax is added and an email is sent. The updated order goes back to the order service where it can be queried via the orders view this is an implementation of CQRS (command query responsibility segregation pattern).

There are two consequences of eventual consistency in our context

### Timelines (lag)

when two different services process the same event stream and due to network, and clock conditions they will process them at different rates so one might lag behind the other. looking back at our design anyway, I finished the article. the content is very good, I would rate it higher than Redis and Kafka because its subject is rarely described in a good use case. still, my biggest concern is without revision many people will struggle to get the point and will get lost in expressions and terminology the user can navigate to check the order, assume the email service and orders views subscribe to the same event that holds the validated orders processed/produced/created by the validation service and process them concurrently means one lag rarely behind the other, in fact, if we stopped write to our system they will be eventually in the same state but normally they will be rarely lag behind each other so they deficit timeliness with respect to one another so when the user clicks the link in the email but the order service view is lagging the link would return an incorrect order state. so we can solve this problem by blocking the call to the order service until the view is updated with timeout or alternatively we can add another event (view updated event) the email service will trigger based on this event both of them consider a serial execution in a different manner.

### Collisions

Collisions happen when two services update the same event at the same time this inherently won't happen in serial execution design but it can happen if we allow the concurrent execution. looking back on our design assume the validation service and tax service execute concurrently as both of them can react to the order requested event ( exactly we can make both of them execute in serial order by making the tax service react to the requested event and then force validation service to react to the tax added event but this will introduce another end-to-end latency problem due to network condition) by executing then concurrently we might end up with two events with important information so to get the correct order we need to merge the two events in both services ( order service in query order view and email service) the merging approach in some business system can be error-prone, especially to the same event that holds the validated orders processed/produced/created by the validation service money such as e-commerce and retail systems. There is a formal technique for merging data in this way that guarantees the integrity called CRDT (conflict-free-replicated-data-type)

In distributed computing, CRDTs is mathematically always possible to merge or resolve concurrent updates without conflicts or a central arbiter A key approach is to reduce all edit operations to just commutative ones so that the order of the changes no longer matters. In practice, this takes care of changes that arrive “out of order” because either there is no fixed order for independent changes occurring on different replicas, or when there is a valid order, there is no guarantee that changes can propagate to every recipient to adhere to it and it essentially restricts which operations you can perform to ensure that when data is changed and later merged you do not lose information but the downside is that the dialect is relatively limited.

### there are two kinds of CRDT

Operation-based CRDTs
Operation-based CRDTs are also called commutative replicated data types, or CmRDTs. CmRDT replicas propagate state by transmitting only the update operation. For example, a CmRDT of a single integer might broadcast the operations (+10) or (−20). Replicas receive the updates and apply them locally. The operations are commutative. However, they are not necessarily idempotent. The communications infrastructure must therefore ensure that all operations on a replica are delivered to the other replicas, without duplication, but in any order.

State-based CRDTs
State-based CRDTs are called convergent replicated data types, or CvRDTs. In contrast to CmRDTs, CvRDTs send their full local state to other replicas, where the states are merged by a function that must be commutative, associative, and idempotent. The merge function provides a join for any pair of replica states, so the set of all states forms a semilattice. The update function must monotonically increase the internal state, according to the same partial order rules as the semilattice.

Better accommodation for large scale systems is to keep the lack of timelines which allows us to have replicas of the same state available as read-only but remove the opportunity for collisions altogether by disallowing concurrent mutations we can achieve this by providing a single writer to each type of event (topics in case of Kafka) or to each state transitions.

### Single writer pattern

The idea behind this principle is to isolate consistent concerns into owning services as the responsibility for propagating events of a specific type is assigned to a single service so in an e-commerce system for example the order entity events should own by the order service, single writer principle also used in a single leader replication in database systems when only a single node receive only the write request while others for read-only. this makes it easier to manage consistency efficiently also this principle allows data versioning that allows optimistic concurrency control by checking the version number, it facilitates the change management such as data schema change as it is owned by a dedicated service that is owned by a single team.

![Eventual consistancy](/eventual-consistancy-4.jpg)

As we see all order entity related events are owned by the order service instead of sharing a global consistency model we used a single write to create local points of consistency that are connected via the event stream and actually, we can solve the problem of scaling the single-threaded operation by adding more partitions of our stream as needed in case of Kafka with a message key, for example, ORDER_ID that guarantee a serial order processing over a single partition.

There are two various approaches to this pattern

### Command Topic

In this approach, we provide a couple of topics for every entity one for the command and one for the entity for example in order entity events can be divided into two topics (Order Requested) which is the command, and (order validated, order completed) which is for the entity, in this case, any service can write to the order requested (the command) but only the order service can write to order entity that manages the order state transition and forcing permissions per topics.

### Single writer per transition

A less efficient and strict variant of the single writer involves services owning individual transitions rather than all transitions in a topic for example instead of using a payment topic for the payment entity that should be owned by the payment service it might simply add extra payment information to the existing order message by a take into our consideration to add a payment schema to order message from the beginning.

#### In the end, I would say dealing with distributed system is not that easy and nothing can fit all problems so try to keep it simple as much as you can to reduce the necessity of a complex approach.
