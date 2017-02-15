import styled from 'styled-components';

const SplitPanel = styled.div`
@media screen and (min-width: 768px) {
    & > * {
        width: 50%;
        float: left;
    }

    & > *:first-child {
        padding-right: 1rem;
    }

    & {
        overflow: auto;
    }
}
`;

export default SplitPanel;
