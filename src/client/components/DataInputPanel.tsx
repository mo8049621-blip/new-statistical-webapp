import { Box, Button, Grid, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import FileUploader from './FileUploader';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import { useState } from 'react';
import { DataInputPanelProps } from '../types';

function DataInputPanel({ onDataChange }: DataInputPanelProps) {
  const [activePanel, setActivePanel] = useState<string>('distribution');

  return (
    <Box p={6} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
      <Tabs defaultIndex={0} w="100%" onChange={(index: number) => {
        const panels = ['upload', 'distribution', 'ai'];
        setActivePanel(panels[index]);
      }}>
        <TabList mb="4" gridTemplateColumns="repeat(3, 1fr)">
          <Tab>File Upload</Tab>
          <Tab>Distribution Generation</Tab>
          <Tab>AI Data Generation</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FileUploader onDataChange={onDataChange} />
          </TabPanel>
          <TabPanel>
            <DistributionGenerator onDataChange={onDataChange} />
          </TabPanel>
          <TabPanel>
            <AIDataGenerator onDataChange={onDataChange} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {activePanel === 'upload' && (
        <FileUploader onDataChange={onDataChange} />
      )}
      {activePanel === 'distribution' && (
        <DistributionGenerator onDataChange={onDataChange} />
      )}
      {activePanel === 'ai' && (
        <AIDataGenerator onDataChange={onDataChange} />
      )}
    </Box>
  );
}

export default DataInputPanel;