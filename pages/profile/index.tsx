import React from "react";
import Wrapper from "@/components/Wrapper";
import CompanyProfileTab from "@/components/Profile/Tabs/CompanyProfile";
import DocumentsTab from "@/components/Profile/Tabs/Documents";
import PasswordsTab from "@/components/Profile/Tabs/Passwords";
import InsuranceTab from "@/components/Profile/Tabs/Insurance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile: React.FC = () => {
    return (
    <Wrapper title="Settings">
    <Tabs
              defaultValue="company-profile"
              className="w-full flex flex-col flex-1 overflow-hidden mt-6 min-h-0"
            >
              <TabsList className="h-12 flex-shrink-0 px-6 rounded-md w-full overflow-x-auto whitespace-nowrap flex gap-2 justify-start">
          <TabsTrigger value="company-profile" key="company-profile" className="text-sm lg:text-md flex-grow">
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="documents" key="documents" className="text-sm lg:text-md flex-grow">
            Documents
          </TabsTrigger>
          <TabsTrigger value="passwords" key="passwords" className="text-sm lg:text-md flex-grow">
            Passwords
          </TabsTrigger>
          <TabsTrigger value="insurance" key="insurance" className="text-sm lg:text-md flex-grow">
            Insurance Information
          </TabsTrigger>
      </TabsList>
      <TabsContent value="company-profile" className="flex-1 overflow-auto min-h-0">
        <CompanyProfileTab />
      </TabsContent>
      <TabsContent value="documents" className="flex-1 overflow-auto">
        <DocumentsTab />
      </TabsContent>
      <TabsContent value="passwords" className="flex-1 overflow-auto">
        <PasswordsTab />
      </TabsContent>
      <TabsContent value="insurance" className="flex-1 overflow-auto">
        <InsuranceTab />
      </TabsContent>
    </Tabs>
    </Wrapper>
  );
};

export default Profile;
