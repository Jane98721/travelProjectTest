
// cli.ts
import * as readline from 'readline';
import { trips as importedTrips, type Trip, type Activity } from './models.js';
import { calculateTotalCost, getHighCostActivities } from './services/budgetService.js';
import { v4 as uuidv4 } from 'uuid';

// Creating readline interface for user input and output in the console.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question: string): Promise<string> =>
  new Promise(resolve => rl.question(question, resolve));

// Creating helper function to select a trip, which is used in multiple actions. 
// It checks if there are any trips available and returns the first one, 
// or throws an error if no trips exist.

export function selectTrip(): Trip {
  const trip = importedTrips[0];
  if (!trip) {
    throw new Error('No trips available. Create a trip first.');
  }
  return trip;
}

// Creating main menu function to display options to the user and handle their choice.

async function showMenu(): Promise<void> {
  console.log('\n🌍 Travel Planner CLI');
  console.log('1. Create Trip');
  console.log('2. Add Activity');
  console.log('3. View Total Trip Cost');
  console.log('4. Show High Cost Activities');
  console.log('5. Exit');

  const choice = await ask('Choose an option: ');
  await handleAction(choice.trim());
}

// ================= ACTIONS =================

const handleAction = async (choice: string): Promise<void> => {
  switch (choice) {

    case '1': {
      const destination = await ask('Trip Destination: ');
      const trip: Trip = {
        id: uuidv4(),
        destination: destination.trim(),
        startDate: String(new Date()), // Date is not a string
        activities: [],
        currency: '',
        flag: ''
      };
      importedTrips.push(trip);
      console.log('✅ Trip created!');
      break;
    }

    case '2': {
      try {
        const trip = selectTrip();
        const name = await ask('Activity Name: ');
        const costStr = await ask('Activity Cost: ');
        const cost = Number(costStr);

        if (!name.trim() || isNaN(cost)) {
          console.log('❌ Invalid name or cost');
          break;
        }

        const activity: Activity = {
          id: uuidv4(),
          name: name.trim(),
          cost,
          category: 'sightseeing', // default
          startTime: new Date()
        };

        trip.activities.push(activity);
        console.log('✅ Activity added!');
      } catch (error: any) {
        console.log(`⚠️ ${error.message}`);
      }
      break;
    }

    case '3': {
      try {
        const trip = selectTrip();
        const total = calculateTotalCost(trip);
        console.log(`\n💰 Total Trip Cost: $${total}`);
      } catch (error: any) {
        console.log(`⚠️ ${error.message}`);
      }
      break;
    }

    case '4': {
      try {
        const trip = selectTrip();
        const thresholdStr = await ask('Enter cost threshold: ');
        const threshold = Number(thresholdStr);

        if (isNaN(threshold)) {
          console.log('❌ Invalid number');
          break;
        }

        const highCostActivities = getHighCostActivities(trip, threshold);
        console.log(`\n🔥 Activities above $${threshold}:`);
        highCostActivities.forEach(a =>
          console.log(`- ${a.name} ($${a.cost})`)
        );
        console.log(`Total: ${highCostActivities.length}`);
      } catch (error: any) {
        console.log(`⚠️ ${error.message}`);
      }
      break;
    }

    case '5':
      console.log('👋 Goodbye!');
      rl.close();
      process.exit(0);

    default:
      console.log('❌ Invalid option');
  }

  await showMenu();
};

// ================= START APP =================

console.log('Welcome to the Travel Planner CLI!');
showMenu();