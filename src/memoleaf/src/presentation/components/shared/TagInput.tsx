import { useState, type KeyboardEvent } from 'react';
import { TagChip } from './TagChip';

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

/**
 * タグ入力コンポーネント
 * テキスト入力後、Enter または カンマ で確定する
 * 確定済みタグはTagChipとして表示し、× で削除できる
 */
export function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') return;
    // 重複防止
    if (tags.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // 入力が空の状態でBackspaceを押すと最後のタグを削除
      onChange(tags.slice(0, -1));
    }
  };

  const handleChange = (value: string) => {
    // カンマが含まれている場合はその場で分割・確定
    if (value.includes(',')) {
      const parts = value.split(',');
      // 最後の部分だけ入力欄に残す
      const toAdd = parts.slice(0, -1);
      toAdd.forEach((p) => addTag(p));
      setInputValue(parts[parts.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center p-2 rounded-md border border-stone-300 bg-white min-h-[40px] focus-within:border-green-600 transition-colors">
      {tags.map((tag, i) => (
        <TagChip key={tag} label={tag} onRemove={() => removeTag(i)} />
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? 'タグを入力（Enterまたは,で確定）' : ''}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-stone-700 placeholder-stone-400"
      />
    </div>
  );
}
