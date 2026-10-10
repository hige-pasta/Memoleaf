import leafIcon from '../../../assets/icons/leaf.svg';
import treeIcon from '../../../assets/icons/tree.svg';
import seedIcon from '../../../assets/icons/seed.svg';

const ICONS = {
  leaf: leafIcon,
  tree: treeIcon,
  seed: seedIcon,
} as const;

type PageIconProps = {
  name: keyof typeof ICONS;
  className?: string;
};

/**
 * ページアイコン（leaf / tree / seed）
 * SVG をマスクとして使い、文字色（currentColor）で塗る。
 * <img> だと色が変えられないため、ナビのアクティブ色などに追従できるようにしている。
 */
export function PageIcon({ name, className = 'size-6' }: PageIconProps) {
  const url = `url("${ICONS[name]}")`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
