export type Activity = {
  id: string;
  name: string;
  cost: number;
  category: 'food' | 'transport' | 'sightseeing';
  startTime: Date;
};

export type Trip = {
  id: string,
  destination: string;
  startDate: string;
  activities: Activity[];
  currency: string,
  flag: string 
}

