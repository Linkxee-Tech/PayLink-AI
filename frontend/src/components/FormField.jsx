import { ChevronDown } from 'lucide-react';

const cx = (...classNames) => classNames.filter(Boolean).join(' ');

const FormField = ({
  as = 'input',
  icon: Icon,
  label,
  hint,
  hintClassName = '',
  labelClassName = '',
  wrapperClassName = '',
  controlClassName = '',
  className = '',
  children,
  id,
  name,
  ...props
}) => {
  const Component = as;
  const controlId = id || name;
  const hintId = hint && controlId ? `${controlId}-hint` : undefined;
  const isSelect = as === 'select';
  const isTextarea = as === 'textarea';

  const inputClasses = cx(
    'w-full rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_1px_2px_rgb(15,23,42,0.03)] transition-all placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 invalid:border-red-300 invalid:bg-red-50/40 invalid:text-slate-900',
    Icon && !isTextarea ? 'pl-14' : 'px-5',
    isTextarea ? 'min-h-[120px] py-4' : 'py-3.5',
    isSelect ? 'appearance-none pr-12' : 'pr-4',
    className,
  );

  return (
    <div className={cx('space-y-2', wrapperClassName)}>
      {label ? (
        <label htmlFor={controlId} className={cx('ml-1 text-sm font-bold text-slate-700', labelClassName)}>
          {label}
        </label>
      ) : null}

      <div className={cx('relative', controlClassName)}>
        {Icon ? (
          <Icon
            size={18}
            className={cx(
              'pointer-events-none absolute left-4 z-10 text-slate-400',
              isTextarea ? 'top-5' : 'top-1/2 -translate-y-1/2',
            )}
          />
        ) : null}

        <Component id={controlId} name={name} aria-describedby={hintId} className={inputClasses} {...props}>
          {children}
        </Component>

        {isSelect ? (
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        ) : null}
      </div>

      {hint ? (
        <p id={hintId} className={cx('ml-1 text-xs leading-5 text-slate-500', hintClassName)}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
