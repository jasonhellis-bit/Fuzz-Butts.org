export const sampleCats = [
  {
    name: "Ali",
    breed: "Siamese",
    age: 2,
    description: "A playful and affectionate cat.",
    imageUrl: "/cats/ali.jpg",
  },
  {
    name: "Eggs",
    breed: "Domestic Shorthair",
    age: 3,
    description: "Loves to cuddle and is great with kids.",
    imageUrl: "/cats/eggs.jpg",
  },
  {
    name: "Luna",
    breed: "Maine Coon",
    age: 1,
    description: "A gentle giant who enjoys lounging and being petted.",
    imageUrl: "/cats/luna-1.jpg",
  },
  {
    name: "Ham",
    breed: "Bengal",
    age: 4,
    description: "Energetic and loves to play with toys.",
    imageUrl: "/cats/ham.jpg",
  },
  {
    name: "Kiki",
    breed: "Persian",
    age: 5,
    description: "Calm and loves to be pampered.",
    imageUrl: "/cats/kiki.jpg",
  },
  {
    name: "Ozzie",
    breed: "Ragdoll",
    age: 3,
    description: "A sweet cat who loves to be held and cuddled.",
    imageUrl: "/cats/ozzie.jpg",
  },
];

export const sampleUsers = [
  {
    name: "Amelia Duncan",
    email: "amelia.duncan@fuzzbutts.org",
    role: "Admin",
    audit: [
      {
        action: "Created cat profile for Ali",
        timestamp: "2024-06-01T10:00:00Z",
      },
      {
        action: "Updated cat profile for Luna",
        timestamp: "2024-06-02T14:30:00Z",
      },
    ],
  },
  {
    name: "Jason Ellis",
    email: "jason.ellis@fuzzbutts.org",
    role: "Chief Nerd",
    audit: [
      {
        action: "Approved adoption application for Eggs",
        timestamp: "2024-06-03T09:15:00Z",
      },
      {
        action: "Deleted cat profile for Ham",
        timestamp: "2024-06-04T16:45:00Z",
      },
    ],
  },
];
