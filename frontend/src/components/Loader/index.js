import { TailSpin, ThreeDots } from "react-loader-spinner";

import "./loader.css";

const Loader = (props) => {
    const { spinner, visible, modalLogin } = props;
    return (
        <div className={spinner && modalLogin ? "modalLoader" : spinner ? "loader" : "dotLoader"}  >
            {spinner ? (
                <TailSpin color="#00BFFF" height={50} width={50} visible={visible} />
            ) : (
                <ThreeDots color="#00BFFF" height={50} width={50} visible={visible} />
            )}
        </div>
    );
};

export default Loader;