export const locationData = {
  countries: [
    {
      id: 1,
      name: "India",
      states: [
        {
          id: 101,
          name: "Kerala",
          cities: [
            {
              id: 1001,
              name: "Kozhikode",
              subLocations: ["West Hill", "Feroke", "Ramanattukara", "Medical College"]
            },
            {
              id: 1002,
              name: "Kochi",
              subLocations: ["Fort Kochi", "Marine Drive", "Edapally", "Kakkanad"]
            }
          ]
        },
        {
          id: 102,
          name: "Maharashtra",
          cities: [
            {
              id: 1003,
              name: "Mumbai",
              subLocations: ["Andheri", "Bandra", "Dadar", "Powai"]
            },
            {
              id: 1004,
              name: "Pune",
              subLocations: ["Hinjewadi", "Kothrud", "Viman Nagar", "Baner"]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "USA",
      states: [
        {
          id: 201,
          name: "California",
          cities: [
            {
              id: 2001,
              name: "Los Angeles",
              subLocations: ["Beverly Hills", "Santa Monica", "Hollywood", "Downtown"]
            },
            {
              id: 2002,
              name: "San Francisco",
              subLocations: ["Mission District", "Financial District", "Chinatown", "SOMA"]
            }
          ]
        },
        {
          id: 202,
          name: "New York",
          cities: [
            {
              id: 2003,
              name: "New York City",
              subLocations: ["Manhattan", "Brooklyn", "Queens", "Bronx"]
            }
          ]
        }
      ]
    }
  ]
};