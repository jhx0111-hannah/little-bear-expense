import type { Category } from '../../types/expense';
import CategoryIcon from '../common/CategoryIcon';
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
          <CategoryIcon name={cat.name} size={40} />
          <span className={styles.name}>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
