/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("newsletterSubscribers");
  collection.indexes.push("CREATE UNIQUE INDEX idx_newsletterSubscribers_email ON newsletterSubscribers (email)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("newsletterSubscribers");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_newsletterSubscribers_email"));
  return app.save(collection);
})
