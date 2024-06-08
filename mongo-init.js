print('Start #################################################################');

db = db.getSiblingDB('gabibbok')
print('selected db: ' + db.getName());

print('Creating user: gabibbokbackend');
db.createUser({
    user: "gabibbokbackend",
    pwd: "gabibbokbackend",
    roles: [
        {
            role: "dbOwner",
            db: "gabibbok"
        }
    ]   
})

print('User created: gabibbokbackend');

print('End #################################################################');