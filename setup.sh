sudo killall node

cd ../messagebus/
git clean -fdx
npm install
npm start &

cd ../objectfactory/
git clean -fdx
npm install
npm start &

cd ../gamedesigner/
git clean -fdx
npm install
npm start &
