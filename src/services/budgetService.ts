//BUDGET SERVICE

//Importing types Trip, Activity from the models
import { type Trip, type Activity} from '../models.js';


//Function receive the object trip and return the number with the cost of the trip.
// Function to calculate the total cost of a trip by summing up the cost of all activities.
//Export is used the function to be used in other files. 
// It uses the reduce method reduce array in one value.
//Trip.activities is the array of Activity.
export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce(
    (sum: number, activity: Activity) => sum + activity.cost,
    0
  );
};

// Function that receive a trip, one value limit (treshold), and return of an array of Activity.
//Filter to return only the activities that have a cost higher than the threshold.
export const getHighCostActivities = (
  trip: Trip,
  threshold: number
): Activity[] => {
  return trip.activities.filter(
    (activity: Activity) => activity.cost > threshold
  );
};

//console.log('Budget service loaded \n');
//console.log(`Total Cost is: ${calculateTotalCost(trips[0])}\n`);
//console.log('High cost activities: ' + getHighCostActivities(trips[0], 100).length + '\n');







