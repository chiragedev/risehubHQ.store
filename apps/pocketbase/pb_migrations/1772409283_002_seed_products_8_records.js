/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("title", "Figma UI Kit");
    record0.set("description", "Complete design system with 500+ components");
    record0.set("price", 49);
    record0.set("category", "Design");
    record0.set("imageUrl", "https://images.unsplash.com/photo-1561070791-2526d30994b5");
    record0.set("gumroadUrl", "https://gumroad.com/example1");
    record0.set("featured", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("title", "React Components Library");
    record1.set("description", "Production-ready React components with TypeScript");
    record1.set("price", 79);
    record1.set("category", "Development");
    record1.set("imageUrl", "https://images.unsplash.com/photo-1633356122544-f134324ef6db");
    record1.set("gumroadUrl", "https://gumroad.com/example2");
    record1.set("featured", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("title", "Web Design Course");
    record2.set("description", "Complete web design masterclass");
    record2.set("price", 99);
    record2.set("category", "Education");
    record2.set("imageUrl", "https://images.unsplash.com/photo-1552664730-d307ca884978");
    record2.set("gumroadUrl", "https://gumroad.com/example3");
    record2.set("featured", false);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("title", "Icon Pack Pro");
    record3.set("description", "5000+ customizable icons");
    record3.set("price", 29);
    record3.set("category", "Design");
    record3.set("imageUrl", "https://images.unsplash.com/photo-1611532736597-de2d4265fba3");
    record3.set("gumroadUrl", "https://gumroad.com/example4");
    record3.set("featured", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("title", "Tailwind CSS Templates");
    record4.set("description", "30 ready-to-use Tailwind templates");
    record4.set("price", 39);
    record4.set("category", "Development");
    record4.set("imageUrl", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97");
    record4.set("gumroadUrl", "https://gumroad.com/example5");
    record4.set("featured", false);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("title", "Branding Toolkit");
    record5.set("description", "Complete brand identity package");
    record5.set("price", 149);
    record5.set("category", "Design");
    record5.set("imageUrl", "https://images.unsplash.com/photo-1561070791-2526d30994b5");
    record5.set("gumroadUrl", "https://gumroad.com/example6");
    record5.set("featured", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("title", "JavaScript Masterclass");
    record6.set("description", "Advanced JavaScript patterns and techniques");
    record6.set("price", 89);
    record6.set("category", "Education");
    record6.set("imageUrl", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97");
    record6.set("gumroadUrl", "https://gumroad.com/example7");
    record6.set("featured", false);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("title", "Motion Design Guide");
    record7.set("description", "Complete guide to motion and animation");
    record7.set("price", 59);
    record7.set("category", "Design");
    record7.set("imageUrl", "https://images.unsplash.com/photo-1633356122544-f134324ef6db");
    record7.set("gumroadUrl", "https://gumroad.com/example8");
    record7.set("featured", true);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
