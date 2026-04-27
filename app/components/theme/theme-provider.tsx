import { useEffect, type PropsWithChildren } from 'react';

export const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: string }>) => {
    useEffect(() => {
        const root = document.documentElement;
        // Remove any existing theme class
        root.classList.remove('light', 'dark', 'system');
        // Add the current theme class (Tailwind & shadcn use 'dark')
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.add('light'); // optional, but keeps consistency
        } else {
            root.classList.add('system')
        }
        // Optionally set a data attribute if your CSS needs more granularity
        root.setAttribute('data-theme', theme);
    }, [theme]);

    return <div className={theme}>
        {children}
    </div>
};