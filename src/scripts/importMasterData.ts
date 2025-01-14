const execute = async () => {
  process.kill(process.pid);
};

execute();
