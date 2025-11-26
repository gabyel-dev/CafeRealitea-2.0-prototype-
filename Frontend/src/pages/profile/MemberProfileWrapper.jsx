import { useState, lazy, Suspense } from "react";
import Loader from "../../components/UI/loaders/Loader";

import UsersManagement from "../members/members";
import MemberProfile from "./members_profile";

export default function MemberProfileWrapper({ activeTab, setActiveTab }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div className="bg-indigo-50 w-full  ">
      <main>
        <div hidden={activeTab !== "Members"}>
          <UsersManagement
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setSelectedUserId={setSelectedUserId}
          />
        </div>

        <div hidden={activeTab !== "member_profile"}>
          <MemberProfile
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            userId={selectedUserId}
          />
        </div>
      </main>
    </div>
  );
}
