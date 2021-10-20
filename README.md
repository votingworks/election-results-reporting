# Demo Election Night Reporting App

<http://votingworks.github.io/election-results-reporting>


# Start Server

Replace constant values with values from results server…

    REACT_APP_ELECTION_HASH='cd18d024467a10d6f4abcd042f26035a0723d82bb375ce9eae1f1665282a13d1' REACT_APP_IS_LIVE=0 pnpm start

# Dev Notes

## Build/Install VxSuite Packages

Do the same for both `libs/utils` and `libs/types`

In VxSuite…

    cd ~/Development/vxsuite/libs/utils
    pnpm install
    pnpm build
    pnpm pack
    cd ~/Development/vxsuite/libs/types
    pnpm install
    pnpm build
    pnpm pack

In this repo:

    mkdir types
    mkdir types/@votingworks
    cd types
    cp ~/Development/vxsuite/libs/utils/votingworks-utils-1.0.0.tgz .
    cp ~/Development/vxsuite/libs/types/votingworks-types-1.0.0.tgz .
    tar xvf votingworks-utils-1.0.0.tgz
    mv package @votingworks/utils
    tar xvf votingworks-types-1.0.0.tgz
    mv package @votingworks/types
    pnpm install
