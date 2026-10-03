import { pathToFileURL } from "node:url";
import { db } from "./connection";
import { tasks, services, users, categories } from "./schema";

const seed = async () => {
  console.log("🌱 Start seeding data... ");
  try {
    console.log("Clearing the database ... ");

    db.delete(users);
    db.delete(tasks);
    db.delete(services);
    db.delete(categories);
    console.log("Inserting data ...");
    const [demoUser] = await db
      .insert(users)
      .values({
        email: "hamza@email.com",
        password: "qweasd",
        fullName: "Hamza Hm",
        phone: "0998558303",
        city: "Damascus",
        role: "superadmin",
        isActive: true,
      })
      .returning();
    const [demoCategory] = await db
      .insert(categories)
      .values({
        nameAr: "تقنيات",
        nameEn: "Technology",
        description: "Programming or embeded systems and electronics",
      })
      .returning();
    await db.insert(services).values({
      titleAr: "تطوير مواقع",
      titleEn: "Web development",
      budgetAmount: 300,
      budgetCurrency: "USD",
      city: "Damascus",
      description: "Programming in HTML,css , Javascript ",
      categoryId: demoCategory.id,
      userId: demoUser.id,
    });
    await db.insert(tasks).values({
      titleAr: "مهمة تطوير مواقع",
      titleEn: "Web development task",
      budgetAmount: 400,
      budgetCurrency: "SYP",
      city: "Aleppo",
      description: "Python ",
      categoryId: demoCategory.id,
      userId: demoUser.id,
    });
    console.log("seed complete ✅ ");
    console.log(`with username ${demoUser.fullName}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
export default seed;
