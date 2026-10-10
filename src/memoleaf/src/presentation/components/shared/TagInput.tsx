import { useState, type KeyboardEvent } from 'react';
import { TagChip } from './TagChip';
import { PlusIcon } from './icons';

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
    // IME変換確定のEnterではタグを確定しない
    if (e.nativeEvent.isComposing) return;
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
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag, i) => (
        <TagChip key={tag} label={tag} onRemove={() => removeTag(i)} />
      ))}
      <label className="inline-flex h-[30px] items-center gap-1 rounded-full border border-dashed border-line-strong px-2.5 text-[13px] text-ink-3 transition focus-within:border-moss focus-within:text-ink-2">
        <PlusIcon className="size-3.5" />
        <span className="sr-only">タグを追加（Enterまたは,で確定）</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="タグ"
          className="w-12 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3 transition-[width] focus:w-28"
        />
      </label>
    </div>
  );
}
