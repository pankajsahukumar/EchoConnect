import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import TemplateBuilder from './TemplateBuilder';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: theme.palette.background.paper,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
    },
    '& .FusePageSimple-content': {
        height: '100%',
    },
}));

function TemplatePage({ mode }) {
    return (
        <Root
            content={<TemplateBuilder mode={mode} />}
            scroll="content"
        />
    );
}

export default withReducer('templateBuilder', reducer)(TemplatePage);
