
import * as readline from 'readline';
import { trips } from './models';
import {
  calculateTotalCost,
  getHighCostActivities
} from './services/budgetService';


// Creating readline

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question: string): Promise<string> =>
  new Promise(resolve => rl.question(question, resolve));

// Creating Budget Service Menu

const showMenu = async (): Promise<void> => {
  console.log('\n💰 Budget Menu');
  console.log('1. Add Activity');
  console.log('2. View Total Trip Cost');
  console.log('3. Show High Cost Activities');
  console.log('4. Exit');

  const choice = await ask('\nChoose an option: ');
  await handleAction(choice);
};

// Actions for the menu options, including adding an activity, viewing total cost, 
// and showing high cost activities. Each action includes error handling for invalid input.

const handleAction = async (choice: string): Promise<void> => {

  if (!trips.length) {
    // create a default trip automatically
    trips.push({
        id: '1',
        destination: 'My Trip',
        startDate: new Date(),
        activities: [],
        currency: '',
        flag: ''
    });
  }

  const trip = trips[0];

  switch (choice.trim()) {

    // Adding activity to the trip, with default values for category and start time, as per instructions.
    case '1': {
      const name = await ask('Activity name: ');
      const cost = Number(await ask('Cost: '));

      if (isNaN(cost)) {
        console.log('❌ Invalid cost');
        break;
      }

      trip.activities.push({
        id: crypto.randomUUID(),
        name,
        cost,
        category: 'sightseeing', // default value
        startTime: new Date()     // default value
      });
      
      console.log('✅ Activity added!');
      break;
    }

    case '2': {
      const total = calculateTotalCost(trip);
      console.log(`\n✅ Total Cost: ${total}`);
      break;
    }

    case '3': {
      const value = await ask('Enter cost threshold: ');
      const threshold = Number(value);

      if (isNaN(threshold)) {
        console.log('❌ Invalid number');
        break;
      }

      const activities = getHighCostActivities(trip, threshold);

      console.log(`\n🔥 Activities above ${threshold}:`);
      activities.forEach(a =>
        console.log(`- ${a.name} ($${a.cost})`)
      );

      console.log(`Total: ${activities.length}`);
      break;
    }

    case '4':
      console.log('\nGoodbye 👋');
      rl.close();
      process.exit(0);

    default:
      console.log('❌ Invalid option');
  }

  await showMenu();
};

// ================= START =================

console.log('🌍 Travel Planner Budget CLI');
showMenu();