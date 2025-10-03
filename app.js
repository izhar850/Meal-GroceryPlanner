// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase Config (replace with your project config)
const firebaseConfig = {
  apiKey: "AIzaSyA7nsixkbsB7Q7LAFuXj53DAf5lYyrtcLw",
  authDomain: "meals-fb309.firebaseapp.com",
  databaseURL: "https://meals-fb309-default-rtdb.firebaseio.com",
  projectId: "meals-fb309",
  storageBucket: "meals-fb309.firebasestorage.app",
  messagingSenderId: "149546993894",
  appId: "1:149546993894:web:3d328c627189975f605327",
  measurementId: "G-1N2DK09QXH"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mealList = document.getElementById("mealList");
const groceryList = document.getElementById("groceryList");

// Add Meal
async function addMeal() {
  const mealName = document.getElementById("mealName").value.trim();
  const ingredient = document.getElementById("ingredient").value.trim();

  if (mealName && ingredient) {
    await addDoc(collection(db, "meals"), {
      meal: mealName,
      ingredient: ingredient,
      bought: false
    });

    document.getElementById("mealName").value = "";
    document.getElementById("ingredient").value = "";
  }
}

// Realtime Fetch Meals
onSnapshot(collection(db, "meals"), (snapshot) => {
  mealList.innerHTML = "";
  groceryList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // ---- Meals List ----
    const liMeal = document.createElement("li");
    liMeal.textContent = `${data.meal} - ${data.ingredient}`;

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "meals", docSnap.id));
    });

    liMeal.appendChild(deleteBtn);
    mealList.appendChild(liMeal);

    // ---- Grocery List ----
    const liGrocery = document.createElement("li");
    liGrocery.textContent = data.ingredient;
    if (data.bought) liGrocery.classList.add("done");

    liGrocery.addEventListener("click", async () => {
      await updateDoc(doc(db, "meals", docSnap.id), {
        bought: !data.bought
      });
    });

    groceryList.appendChild(liGrocery);
  });
});

// Attach addMeal to button
document.getElementById("addMealBtn").addEventListener("click", addMeal);
