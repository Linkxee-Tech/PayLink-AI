const EmptyState = ({ icon, title, description, tone = 'default' }) => {
  const Icon = icon;
  const toneClasses = {
    default: {
      shell: 'border-slate-200 bg-slate-50/80',
      icon: 'bg-white text-primary-600',
      title: 'text-slate-900',
      description: 'text-slate-500',
    },
    dark: {
      shell: 'border-white/10 bg-white/5',
      icon: 'bg-white/10 text-primary-200',
      title: 'text-white',
      description: 'text-slate-400',
    },
  };

  const currentTone = toneClasses[tone] || toneClasses.default;

  return (
    <div className={`rounded-[1.75rem] border px-5 py-8 text-center shadow-sm ${currentTone.shell}`}>
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${currentTone.icon}`}>
        <Icon size={22} />
      </div>
      <h3 className={`text-lg font-bold ${currentTone.title}`}>{title}</h3>
      <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${currentTone.description}`}>{description}</p>
    </div>
  );
};

export default EmptyState;
