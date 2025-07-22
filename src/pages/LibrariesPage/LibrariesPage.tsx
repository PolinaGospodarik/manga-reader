import React, { useContext, useState } from 'react';
import './LibrariesPage.css';
import LibrariesList from '@/components/LibrariesList/LibrariesList';
import StatusTabs from '@/components/StatusTabs/StatusTabs';
import {themeContext} from "@/roviders/ThemeContext";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "@/hooks";
import AccentButton from "@/components/AccentButton/AccentButton";

const STATUSES = [
    { label: 'Reading', value: 'reading' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Dropped', value: 'dropped' },
    { label: 'Plan to Read', value: 'plan_to_read' },
    { label: 'Completed', value: 'completed' },
    { label: 'Re-Reading', value: 're_reading' },
];

const LibrariesPage = () => {
    const [activeStatus, setActiveStatus] = useState(STATUSES[0].value);
    const [color] = useContext(themeContext);
    const user = useAppSelector(state => state.users.user);
    const navigate = useNavigate();

    return (
        <div className={`libraries background-${color}`}>
            <div className="container">
                {user ? (
                    <>
                        <StatusTabs
                            className="libraries__tabs"
                            statuses={STATUSES}
                            activeStatus={activeStatus}
                            onChange={setActiveStatus}
                        />
                        <LibrariesList status={activeStatus} user={user} />
                    </>
                ) : (
                    <div className="libraries__not-auth">
                        <h2 className={`text-${color}`}>Please log in to view your library.</h2>
                        <AccentButton
                            variant="orange"
                            className={`login-button`}
                            onClick={() => navigate('/login')}
                        >
                            Sign in
                        </AccentButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibrariesPage;
