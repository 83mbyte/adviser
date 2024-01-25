import WorkspaceCard from "../WorkspaceComponents/WorkspaceCard";
import { getReplyFromAssistant } from "@/src/lib/fetchingData";
import { useAuthContext } from "@/src/context/AuthContextProvider";


const headerLeftButtons = null;
const headerRightButtons = null;

const YouTubeSummarize = () => {

    const userId = useAuthContext().uid;

    // handlers 
    const onSubmitHandler = async (data) => {
        console.log('onSubmitHandler data: ', data);

        let resp = await getReplyFromAssistant({ type: 'ytsummarize', requestedBy: { userId: userId }, payload: data }, 'summarize');
        if (resp) {
            console.log(resp)
        }
    }

    return (
        <>
            <WorkspaceCard
                cardTitle={'Summarize Youtube video'}
                headerLeftButtons={headerLeftButtons}
                headerRightButtons={headerRightButtons}
                onSubmitHandler={onSubmitHandler}
            >
                sumarize video
            </WorkspaceCard>
        </>
    );
};

export default YouTubeSummarize;




