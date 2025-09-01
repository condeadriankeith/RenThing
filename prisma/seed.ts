import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin accounts
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin1 = await prisma.user.upsert({
    where: { email: 'adriankeithconde@gmail.com' },
    update: {},
    create: {
      email: 'adriankeithconde@gmail.com',
      name: 'Adrian Keith Conde',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const admin2 = await prisma.user.upsert({
    where: { email: 'roelslumauagjr@gmail.com' },
    update: {},
    create: {
      email: 'roelslumauagjr@gmail.com',
      name: 'Roel Jr Lumauag',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create a demo owner user
  const demoUser = await prisma.user.upsert({
    where: { email: 'owner@renthing.com' },
    update: {},
    create: {
      email: 'owner@renthing.com',
      name: 'Demo Owner',
      password: hashedPassword,
      role: 'USER',
    },
  })

  console.log('Created admin accounts:', admin1.email, admin2.email)
  console.log('Created demo user:', demoUser.email)

  // Create comprehensive rental listings
  const listings = [
    // Electronics
    {
      title: "MacBook Pro 16-inch M2 Max",
      description: "Professional laptop perfect for video editing, development, and creative work. Includes charger and carrying case.",
      price: 45.0,
      location: "San Francisco, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
      ]),
      features: JSON.stringify(["16GB RAM", "512GB SSD", "M2 Max Chip", "Retina Display", "Touch Bar"])
    },
    {
      title: "Canon EOS R5 Mirrorless Camera",
      description: "Professional 45MP full-frame camera with 8K video recording. Perfect for photography and videography projects.",
      price: 35.0,
      location: "Los Angeles, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500"
      ]),
      features: JSON.stringify(["45MP Sensor", "8K Video", "Image Stabilization", "Dual Card Slots", "Weather Sealed"])
    },
    {
      title: "Sony A7 III Camera with 24-70mm Lens",
      description: "Full-frame mirrorless camera with versatile zoom lens. Ideal for events, portraits, and travel photography.",
      price: 30.0,
      location: "New York, NY",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500"
      ]),
      features: JSON.stringify(["24MP Sensor", "4K Video", "5-axis Stabilization", "Dual Card Slots"])
    },
    {
      title: "iPad Pro 12.9-inch with Apple Pencil",
      description: "Latest iPad Pro with M2 chip and Apple Pencil. Perfect for digital art, note-taking, and presentations.",
      price: 25.0,
      location: "Austin, TX",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
      ]),
      features: JSON.stringify(["M2 Chip", "12.9-inch Display", "Apple Pencil Included", "256GB Storage"])
    },
    {
      title: "DJI Mavic Air 2 Drone",
      description: "Professional drone with 4K camera and 34-minute flight time. Includes extra batteries and carrying case.",
      price: 40.0,
      location: "Seattle, WA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500"
      ]),
      features: JSON.stringify(["4K Camera", "34min Flight Time", "Obstacle Avoidance", "Extra Batteries"])
    },

    // Vehicles
    {
      title: "Tesla Model 3 Performance",
      description: "Electric luxury sedan with autopilot and supercharging access. Perfect for weekend trips or special occasions.",
      price: 85.0,
      location: "Palo Alto, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500"
      ]),
      features: JSON.stringify(["Autopilot", "Supercharging", "0-60 in 3.1s", "Premium Interior", "Full Self Driving"])
    },
    {
      title: "BMW X5 SUV",
      description: "Luxury SUV with all-wheel drive and premium amenities. Seats 7 passengers comfortably.",
      price: 65.0,
      location: "Miami, FL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500"
      ]),
      features: JSON.stringify(["All-Wheel Drive", "7 Seats", "Leather Interior", "Navigation", "Panoramic Sunroof"])
    },
    {
      title: "Specialized Trek Mountain Bike",
      description: "High-end mountain bike perfect for trail riding and outdoor adventures. Recently serviced and maintained.",
      price: 15.0,
      location: "Denver, CO",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544191696-15693df71ad4?w=500"
      ]),
      features: JSON.stringify(["29-inch Wheels", "Full Suspension", "21 Speeds", "Disc Brakes", "Recently Serviced"])
    },
    {
      title: "Harley Davidson Street Glide",
      description: "Classic touring motorcycle perfect for long rides and motorcycle enthusiasts. Includes helmet.",
      price: 55.0,
      location: "Phoenix, AZ",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
      ]),
      features: JSON.stringify(["Touring Bike", "Comfortable Seating", "Large Storage", "Helmet Included"])
    },
    {
      title: "Mercedes Sprinter Van",
      description: "Spacious cargo van perfect for moving, deliveries, or group transportation. Clean and well-maintained.",
      price: 45.0,
      location: "Chicago, IL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
      ]),
      features: JSON.stringify(["Large Cargo Space", "Clean Interior", "Reliable", "Easy to Drive"])
    },

    // Tools & Equipment
    {
      title: "Dewalt 20V Max Drill Set",
      description: "Complete cordless drill set with multiple bits and two batteries. Perfect for home improvement projects.",
      price: 12.0,
      location: "Houston, TX",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500"
      ]),
      features: JSON.stringify(["20V Battery", "Multiple Bits", "2 Batteries", "Carrying Case", "LED Light"])
    },
    {
      title: "Bosch Circular Saw",
      description: "Professional-grade circular saw for woodworking and construction projects. Includes safety gear.",
      price: 18.0,
      location: "Portland, OR",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1609946924625-7b3bb74dd7db?w=500"
      ]),
      features: JSON.stringify(["7.25-inch Blade", "Laser Guide", "Safety Gear Included", "Dust Port"])
    },
    {
      title: "Pressure Washer 3000 PSI",
      description: "High-pressure washer perfect for cleaning driveways, decks, and vehicles. Includes multiple nozzles.",
      price: 22.0,
      location: "Atlanta, GA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"
      ]),
      features: JSON.stringify(["3000 PSI", "Multiple Nozzles", "Long Hose", "Detergent Tank"])
    },
    {
      title: "Makita Miter Saw",
      description: "Precision miter saw for accurate cuts in woodworking projects. Includes stand and dust collection.",
      price: 28.0,
      location: "Nashville, TN",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1609946924625-7b3bb74dd7db?w=500"
      ]),
      features: JSON.stringify(["10-inch Blade", "Laser Guide", "Stand Included", "Dust Collection"])
    },
    {
      title: "Generator 7500W",
      description: "Portable generator for backup power during outages or outdoor events. Quiet operation and electric start.",
      price: 35.0,
      location: "Orlando, FL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500"
      ]),
      features: JSON.stringify(["7500W Output", "Electric Start", "Quiet Operation", "Multiple Outlets"])
    },

    // Musical Instruments
    {
      title: "Yamaha Grand Piano",
      description: "Beautiful baby grand piano perfect for concerts, recordings, or special events. Professionally tuned.",
      price: 120.0,
      location: "Boston, MA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500"
      ]),
      features: JSON.stringify(["Baby Grand", "Professionally Tuned", "Beautiful Tone", "Concert Quality"])
    },
    {
      title: "Fender Stratocaster Electric Guitar",
      description: "Classic electric guitar with amplifier. Perfect for performances, recordings, or practice sessions.",
      price: 25.0,
      location: "Nashville, TN",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500"
      ]),
      features: JSON.stringify(["Classic Stratocaster", "Amplifier Included", "Guitar Cable", "Picks Included"])
    },
    {
      title: "Pearl Drum Set Complete",
      description: "Professional 5-piece drum set with cymbals and hardware. Ideal for gigs, recording, or practice.",
      price: 45.0,
      location: "Los Angeles, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
      ]),
      features: JSON.stringify(["5-Piece Set", "Cymbals Included", "Hardware Included", "Professional Quality"])
    },
    {
      title: "Violin with Case and Bow",
      description: "High-quality acoustic violin perfect for performances, lessons, or recording sessions. Includes rosin.",
      price: 20.0,
      location: "Philadelphia, PA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=500"
      ]),
      features: JSON.stringify(["Professional Quality", "Case Included", "Bow Included", "Rosin Included"])
    },
    {
      title: "Keyboard Piano 88 Keys",
      description: "Full-size digital piano with weighted keys and multiple sounds. Perfect for practice or performances.",
      price: 18.0,
      location: "San Diego, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
      ]),
      features: JSON.stringify(["88 Weighted Keys", "Multiple Sounds", "Pedal Included", "Stand Included"])
    },

    // Sports Equipment
    {
      title: "Professional Golf Club Set",
      description: "Complete set of Titleist golf clubs with bag. Perfect for golf enthusiasts and tournaments.",
      price: 30.0,
      location: "Scottsdale, AZ",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500"
      ]),
      features: JSON.stringify(["Titleist Clubs", "Complete Set", "Golf Bag", "Professional Quality"])
    },
    {
      title: "Surfboard Longboard 9ft",
      description: "Classic longboard perfect for beginners and experienced surfers. Includes leash and wax.",
      price: 20.0,
      location: "Huntington Beach, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500"
      ]),
      features: JSON.stringify(["9ft Longboard", "Beginner Friendly", "Leash Included", "Wax Included"])
    },
    {
      title: "Ski Equipment Set",
      description: "Complete ski set with boots and poles. Various sizes available for different skill levels.",
      price: 25.0,
      location: "Aspen, CO",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=500"
      ]),
      features: JSON.stringify(["Skis", "Boots", "Poles", "Various Sizes", "All Skill Levels"])
    },
    {
      title: "Kayak Single Person",
      description: "Lightweight single-person kayak perfect for lakes and calm rivers. Includes paddle and life jacket.",
      price: 22.0,
      location: "Lake Tahoe, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500"
      ]),
      features: JSON.stringify(["Single Person", "Lightweight", "Paddle Included", "Life Jacket"])
    },
    {
      title: "Tennis Racket Set",
      description: "Professional tennis rackets with case. Perfect for tournaments or casual play.",
      price: 15.0,
      location: "Miami, FL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc78?w=500"
      ]),
      features: JSON.stringify(["Professional Quality", "Case Included", "Multiple Rackets", "String Tension Adjustable"])
    },

    // Home & Garden
    {
      title: "Wedding Tent 20x30",
      description: "Large white wedding tent perfect for outdoor ceremonies and receptions. Seats up to 150 guests.",
      price: 80.0,
      location: "Napa Valley, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
      ]),
      features: JSON.stringify(["20x30 Size", "White Color", "150 Guest Capacity", "Weather Resistant"])
    },
    {
      title: "Projector 4K Ultra HD",
      description: "High-quality 4K projector perfect for presentations, movie nights, or outdoor events.",
      price: 28.0,
      location: "Las Vegas, NV",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500"
      ]),
      features: JSON.stringify(["4K Resolution", "3000 Lumens", "Multiple Inputs", "Remote Control"])
    },
    {
      title: "Sound System PA Setup",
      description: "Complete PA system with microphones and mixer. Perfect for events, parties, or presentations.",
      price: 50.0,
      location: "Austin, TX",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
      ]),
      features: JSON.stringify(["PA Speakers", "Microphones", "Mixer", "Cables Included"])
    },
    {
      title: "Lawn Mower Zero Turn",
      description: "Professional zero-turn mower for large lawns. Fast and efficient with comfortable seating.",
      price: 40.0,
      location: "Dallas, TX",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
      ]),
      features: JSON.stringify(["Zero Turn", "48-inch Cut", "Comfortable Seat", "Fast Mowing"])
    },
    {
      title: "Party Tables and Chairs Set",
      description: "Complete party furniture set with round tables and folding chairs. Perfect for events.",
      price: 35.0,
      location: "San Antonio, TX",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
      ]),
      features: JSON.stringify(["Round Tables", "Folding Chairs", "Complete Set", "Easy Setup"])
    },

    // Professional Equipment
    {
      title: "3D Printer Prusa i3 MK3S+",
      description: "Professional 3D printer perfect for prototyping and creative projects. Includes filament.",
      price: 32.0,
      location: "San Francisco, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"
      ]),
      features: JSON.stringify(["High Precision", "Auto Bed Leveling", "Filament Included", "User Friendly"])
    },
    {
      title: "Welding Equipment Set",
      description: "Complete welding setup with safety gear. Perfect for metal fabrication and repair projects.",
      price: 45.0,
      location: "Detroit, MI",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500"
      ]),
      features: JSON.stringify(["Complete Setup", "Safety Gear", "Multiple Welding Types", "Professional Grade"])
    },
    {
      title: "Sewing Machine Industrial",
      description: "Heavy-duty industrial sewing machine for professional alterations and garment making.",
      price: 35.0,
      location: "New York, NY",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"
      ]),
      features: JSON.stringify(["Industrial Grade", "Heavy Duty", "Multiple Stitches", "Professional Use"])
    },
    {
      title: "Air Compressor 30 Gallon",
      description: "Large capacity air compressor for pneumatic tools and equipment. Quiet operation.",
      price: 25.0,
      location: "Phoenix, AZ",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500"
      ]),
      features: JSON.stringify(["30 Gallon Tank", "Quiet Operation", "High Pressure", "Multiple Outlets"])
    },
    {
      title: "Carpet Cleaner Professional",
      description: "Commercial-grade carpet cleaning machine perfect for deep cleaning carpets and upholstery.",
      price: 30.0,
      location: "Denver, CO",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"
      ]),
      features: JSON.stringify(["Commercial Grade", "Deep Cleaning", "Upholstery Attachment", "Large Tank"])
    },

    // Party & Events
    {
      title: "Bounce House Large",
      description: "Large inflatable bounce house perfect for children's parties and events. Includes blower.",
      price: 65.0,
      location: "Phoenix, AZ",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
      ]),
      features: JSON.stringify(["Large Size", "Safety Netting", "Blower Included", "Easy Setup"])
    },
    {
      title: "Photo Booth Props Kit",
      description: "Complete photo booth setup with props, backdrop, and instant camera. Perfect for parties.",
      price: 18.0,
      location: "Las Vegas, NV",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500"
      ]),
      features: JSON.stringify(["Props Included", "Backdrop", "Instant Camera", "Complete Setup"])
    },
    {
      title: "DJ Equipment Setup",
      description: "Professional DJ equipment with turntables, mixer, and speakers. Perfect for parties and events.",
      price: 75.0,
      location: "Miami, FL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
      ]),
      features: JSON.stringify(["Turntables", "Mixer", "Speakers", "Microphone", "Complete Setup"])
    },
    {
      title: "Karaoke Machine Professional",
      description: "High-quality karaoke machine with extensive song library and wireless microphones.",
      price: 22.0,
      location: "Chicago, IL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
      ]),
      features: JSON.stringify(["Large Song Library", "Wireless Mics", "Screen Display", "Easy Operation"])
    },
    {
      title: "Chocolate Fountain Commercial",
      description: "Large commercial chocolate fountain perfect for weddings and special events. Includes chocolate.",
      price: 28.0,
      location: "San Diego, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
      ]),
      features: JSON.stringify(["Commercial Size", "Chocolate Included", "Easy Cleanup", "Multiple Tiers"])
    },

    // Outdoor Recreation
    {
      title: "Camping Tent 8 Person",
      description: "Large family camping tent with separate rooms and weather protection. Perfect for group camping.",
      price: 20.0,
      location: "Yellowstone, WY",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551524164-6cf2ac14fb4b?w=500"
      ]),
      features: JSON.stringify(["8 Person Capacity", "Weather Resistant", "Easy Setup", "Multiple Rooms"])
    },
    {
      title: "Fishing Boat with Motor",
      description: "Small fishing boat with outboard motor. Perfect for lake fishing and recreational boating.",
      price: 85.0,
      location: "Lake Tahoe, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500"
      ]),
      features: JSON.stringify(["Outboard Motor", "Fishing Ready", "Life Jackets", "Fishing Gear"])
    },
    {
      title: "RV Motorhome 25ft",
      description: "Comfortable motorhome perfect for family road trips and camping adventures. Sleeps 6.",
      price: 120.0,
      location: "Moab, UT",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
      ]),
      features: JSON.stringify(["Sleeps 6", "Full Kitchen", "Bathroom", "Generator", "Easy to Drive"])
    },
    {
      title: "ATV Quad 4x4",
      description: "All-terrain vehicle perfect for off-road adventures and trail riding. Includes helmet.",
      price: 55.0,
      location: "Moab, UT",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
      ]),
      features: JSON.stringify(["4x4 Capability", "All Terrain", "Helmet Included", "Trail Ready"])
    },
    {
      title: "Paddleboard Inflatable",
      description: "High-quality inflatable paddleboard with pump and paddle. Perfect for lakes and calm waters.",
      price: 18.0,
      location: "Miami Beach, FL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500"
      ]),
      features: JSON.stringify(["Inflatable", "Pump Included", "Paddle Included", "Carry Bag"])
    },

    // Specialty Items
    {
      title: "Espresso Machine Commercial",
      description: "Professional espresso machine perfect for cafes, events, or coffee enthusiasts. Includes grinder.",
      price: 40.0,
      location: "Seattle, WA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1521302200778-33500795e128?w=500"
      ]),
      features: JSON.stringify(["Commercial Grade", "Grinder Included", "Multiple Group Heads", "Steam Wand"])
    },
    {
      title: "Pizza Oven Portable",
      description: "Wood-fired portable pizza oven perfect for outdoor parties and events. Reaches 900°F.",
      price: 35.0,
      location: "Portland, OR",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
      ]),
      features: JSON.stringify(["Wood Fired", "Portable", "900°F Temperature", "Pizza Stone Included"])
    },
    {
      title: "Ice Cream Cart Vintage",
      description: "Charming vintage-style ice cream cart perfect for parties, weddings, and special events.",
      price: 45.0,
      location: "Savannah, GA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
      ]),
      features: JSON.stringify(["Vintage Style", "Mobile Cart", "Freezer Included", "Charming Design"])
    },
    {
      title: "Virtual Reality Setup Complete",
      description: "Complete VR gaming setup with headset, controllers, and gaming library. Perfect for entertainment.",
      price: 25.0,
      location: "San Jose, CA",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500"
      ]),
      features: JSON.stringify(["VR Headset", "Controllers", "Game Library", "Complete Setup"])
    },
    {
      title: "Pottery Wheel Electric",
      description: "Professional electric pottery wheel perfect for ceramics classes and artistic projects.",
      price: 30.0,
      location: "Santa Fe, NM",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"
      ]),
      features: JSON.stringify(["Electric Motor", "Variable Speed", "Professional Quality", "Clay Tools Included"])
    }
  ]

  console.log('Creating listings...')
  
  for (const listing of listings) {
    await prisma.listing.create({
      data: {
        ...listing,
        ownerId: demoUser.id,
      },
    })
  }

  console.log(`Created ${listings.length} listings successfully!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })