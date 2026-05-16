import type { Category } from '../../types/expense';
import styles from './CategoryPicker.module.css';

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <div className={styles.grid}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.item} ${selectedId === cat.id ? styles.selected : ''}`}
          onClick={() => onSelect(cat.id)}
          type="button"
        >
          <span className={styles.icon}>{cat.icon}</span>
          <span className={styles.name}>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
