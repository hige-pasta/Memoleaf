type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

/**
 * ページ上部の見出し
 * 小さなサブタイトル＋大きなページ名の2段構成
 */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-6 flex flex-col gap-0.5">
      {subtitle && (
        <p className="text-[13px] font-medium text-ink-3 tracking-wide tabular-nums">{subtitle}</p>
      )}
      <h1 className="text-[28px] font-bold leading-tight tracking-wide text-ink">{title}</h1>
    </header>
  );
}
