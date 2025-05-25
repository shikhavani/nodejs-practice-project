# Devtinder APIS

authRouter
POST /signup
POST /login
POST /logout

profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

connectionReqRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId

POST /request/review/accepted/:requestId
POST /request/send/rejected/:requestId

userRouter
GET /getConnections
GET /getPendingRequests
GET /feed - gets profile list of users


# STATUS
IGNORE
INTERESTED
ACCEPTED
REJECTED
