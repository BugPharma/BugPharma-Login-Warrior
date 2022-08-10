
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: jest.fn()
}));


jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn()
}));