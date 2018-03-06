reset
sudo killall node

export thisserveraddress
export publishaddress

cd ../messagebus/
git clean -fdx
npm install
npm update
thisserveraddress='localhost:3000'
publishaddress='localhost:3000'
npm start &

cd ../objectfactory/
git clean -fdx
npm install
npm update
thisserveraddress='localhost:4000'
publishaddress='localhost:3000'
npm start &

cd ../gamedesigner/
git clean -fdx
npm install
npm update
thisserveraddress='localhost:5000'
publishaddress='localhost:3000'
npm start &
