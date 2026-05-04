import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const seedDatabase = async (clients: any[], events: any[]) => {
  try {
    for (const client of clients) {
      await setDoc(doc(db, 'clients', client.id), client);
    }
    for (const ev of events) {
      await setDoc(doc(db, 'calendarEvents', ev.id), ev);
    }
    alert('Database sync successful! Data has been pushed to your Firebase Console.');
  } catch (error) {
    console.error('Error syncing database:', error);
    alert('Failed to sync database. Make sure your firestore.rules allow writes.');
  }
};
