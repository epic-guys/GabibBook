db.createUser({
     user: 'username',
     pwd: 'password',
     roles: [{
         role: 'readWrite',
         db: 'database'
     }]
 })
 
 db.auth('root', 'password')
 db = new Mongo().getDB('database')