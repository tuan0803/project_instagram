import _ from 'lodash';
import Parameters from '../libs/parameters';

const strongParams = () => (req: any, res: any, next: any) => {
  let _params: Parameters<typeof req.params>;
  if (!Object.prototype.hasOwnProperty.call(req, 'parameters')) {
    Object.defineProperty(req, 'parameters', {
      get() {
        return _params.clone(); 
      },
      set(value) {
        _params = new Parameters(value); 
      },
      configurable: true, 
    });
  }
  req.parameters = _.merge({}, req.body || {}, req.query || {}, req.params || {}, req.fields || {});

  next();
};

export default strongParams;
