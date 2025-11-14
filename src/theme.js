import { extendTheme } from '@chakra-ui/react';
var theme = extendTheme({
    colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        accent: '#6366F1',
        neutral: '#1F2937',
        'neutral-light': '#F3F4F6',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },
    fonts: {
        heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: '0.5rem',
                fontWeight: '500',
                transition: 'all 0.2s ease-in-out',
            },
            variants: {
                solid: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    _hover: {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transform: 'translateY(-1px)',
                    },
                    _active: {
                        transform: 'translateY(0)',
                    },
                },
                outline: {
                    _hover: {
                        bg: 'rgba(37, 99, 235, 0.05)',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(229, 231, 235, 1)',
                _hover: {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease-in-out',
                },
            },
        },
        Input: {
            baseStyle: {
                borderRadius: '0.375rem',
                border: '1px solid rgba(209, 213, 219, 1)',
                _focus: {
                    borderColor: 'primary',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
            },
        },
        Select: {
            baseStyle: {
                borderRadius: '0.375rem',
                border: '1px solid rgba(209, 213, 219, 1)',
                _focus: {
                    borderColor: 'primary',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
            },
        },
        Tabs: {
            baseStyle: {
                tab: {
                    borderRadius: '0.375rem',
                    _selected: {
                        bg: 'rgba(37, 99, 235, 0.1)',
                        color: 'primary',
                    },
                },
            },
        },
    },
    styles: {
        global: {
            body: {
                bg: 'neutral-light',
                color: 'neutral',
            },
            h1: {
                fontSize: '2.25rem',
                fontWeight: '700',
                color: 'neutral',
            },
            h2: {
                fontSize: '1.875rem',
                fontWeight: '700',
                color: 'neutral',
            },
            h3: {
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'neutral',
            },
        },
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
});
export default theme;
