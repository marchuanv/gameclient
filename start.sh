reset
sudo killall node

export thisserveraddress
export publishaddress

cd ../messagebus/
thisserveraddress='localhost:3000'
publishaddress='localhost:3000'
npm start &

cd ../objectfactory/
thisserveraddress='localhost:4000'
publishaddress='localhost:3000'
npm start &

cd ../gamedesigner/
thisserveraddress='localhost:5000'
publishaddress='localhost:3000'
npm start &
