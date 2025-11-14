import { jsx as _jsx } from "react/jsx-runtime";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import StatisticsApp from './pages/StatisticsApp';
// Create a complete theme configuration ensuring all necessary component styles are included
var theme = extendTheme({
    colors: {
        primary: '#3182ce',
        secondary: '#2d3748',
    },
    fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
    },
    components: {
        // Ensure Tabs component has correct style configuration
        Tabs: {
            baseStyle: {
                tab: {
                    _selected: {
                        color: 'primary',
                    },
                },
            },
        },
    },
});
function App() {
    // Simplify App component and ensure ChakraProvider correctly wraps all components
    return (_jsx(ChakraProvider, { theme: theme, children: _jsx(StatisticsApp, {}) }));
}
export default App;
