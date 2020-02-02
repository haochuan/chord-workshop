import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import Display from '../components/Display';
import {
  Container,
  Card,
  CardContent,
  Switch,
  LinearProgress,
  Slider,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Badge,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const style = {
  card: {
    minWidth: 275,
    padding: 20,
  },
};

const NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const MODIFIERS = ['#', 'b'];
const TYPES = [
  'Maj',
  'Maj7',
  'min',
  'min7',
  'dim',
  'dim7',
  '6',
  '9',
  'sus2',
  'sus4',
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const IOSSwitch = withStyles(theme => ({
  root: {
    width: 252,
    height: 76,
    padding: 0,
    margin: theme.spacing(3),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(178px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#556cd6',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '18px solid #fff',
    },
  },
  thumb: {
    width: 72,
    height: 72,
  },
  track: {
    borderRadius: 78 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

function getLocalCache() {
  return JSON.parse(localStorage.getItem('chordWorkshopCache')) || null;
}

class Home extends React.Component {
  scheduler = null;
  state = {
    running: false,
    chord: {},
    duration: 3,
    progress: 0,
    tabIndex: 0,
    notes: NOTES.map(n => {
      return {
        name: n,
        on: true,
      };
    }),
    modifiers: MODIFIERS.map(m => {
      return {
        name: m,
        on: true,
      };
    }),
    types: TYPES.map(t => {
      return {
        name: t,
        on: true,
      };
    }),
  };

  setPersistState = state => {
    this.setState(state, () => {
       localStorage.setItem('chordWorkshopCache', JSON.stringify(this.state));
    });
  }
  getChord = () => {
    const notes = this.state.notes.filter(n => n.on);
    const modifiers = [...this.state.modifiers, { name: '', on: true }].filter(
      n => n.on,
    ); // '' for natual
    const types = this.state.types.filter(n => n.on);
    console.log({
      note:
        notes.length !== 0 ? notes[getRandomInt(0, notes.length - 1)].name : '',
      mod:
        modifiers.length !== 0
          ? modifiers[getRandomInt(0, modifiers.length - 1)].name
          : '',
      type:
        types.length !== 0 ? types[getRandomInt(0, types.length - 1)].name : '',
    });
    return {
      note:
        notes.length !== 0 ? notes[getRandomInt(0, notes.length - 1)].name : '',
      mod:
        modifiers.length !== 0
          ? modifiers[getRandomInt(0, modifiers.length - 1)].name
          : '',
      type:
        types.length !== 0 ? types[getRandomInt(0, types.length - 1)].name : '',
    };
  };

  toggle = () => {
    if (this.state.running) {
      clearInterval(this.scheduler);
      this.setPersistState({ progress: 0 });
    } else {
      this.setPersistState({ chord: this.getChord() });
      this.scheduler = setInterval(() => {
        if (this.state.progress >= this.state.duration) {
          this.setPersistState({ progress: 1, chord: this.getChord() });
        } else {
          this.setPersistState({ progress: this.state.progress + 1 });
        }
      }, 1000);
    }

    this.setPersistState({ running: !this.state.running });
  };

  renderNoteFilter = () => {
    const { notes } = this.state;
    return (
      <FormGroup row>
        {notes.map((n, index) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={n.on}
                  onChange={() => {
                    this.setPersistState({
                      notes: [
                        ...notes.slice(0, index),
                        { ...n, on: !n.on },
                        ...notes.slice(index + 1),
                      ],
                    });
                  }}
                  value="checked"
                  color="primary"
                  key={index}
                />
              }
              label={n.name}
              key={index}
            />
          );
        })}
      </FormGroup>
    );
  };
  renderModifierFilter = () => {
    const { modifiers } = this.state;
    return (
      <FormGroup row>
        {modifiers.map((n, index) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={n.on}
                  onChange={() => {
                    this.setPersistState({
                      modifiers: [
                        ...modifiers.slice(0, index),
                        { ...n, on: !n.on },
                        ...modifiers.slice(index + 1),
                      ],
                    });
                  }}
                  value="checked"
                  color="primary"
                  key={index}
                />
              }
              label={n.name}
              key={index}
            />
          );
        })}
      </FormGroup>
    );
  };
  renderTypeFilter = () => {
    const { types } = this.state;
    return (
      <FormGroup row>
        {types.map((n, index) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={n.on}
                  onChange={() => {
                    this.setPersistState({
                      types: [
                        ...types.slice(0, index),
                        { ...n, on: !n.on },
                        ...types.slice(index + 1),
                      ],
                    });
                  }}
                  value="checked"
                  color="primary"
                  key={index}
                />
              }
              label={n.name}
              key={index}
            />
          );
        })}
      </FormGroup>
    );
  };

  componentDidMount() {
    if (getLocalCache()) {
      this.setState(getLocalCache());
    }
    this.setPersistState({ chord: this.getChord() });
  }
  render() {
    return (
      <Container fixed>
        <Head title="chord workshop" />
        <Card style={style.card}>
          <div className="controller">
            <IOSSwitch
              checked={this.state.running}
              onChange={this.toggle}
              value="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            <Typography id="non-linear-slider" gutterBottom>
              <span className="duration-text">
                Change chord every{' '}
                <span className="red">{this.state.duration} </span>
                seconds
              </span>
            </Typography>
            <Slider
              defaultValue={3}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              onChange={(e, value) => {
                this.setPersistState({ duration: value });
              }}
              step={1}
              marks
              min={1}
              max={10}
            />
          </div>
          <AppBar position="static">
            <Tabs
              value={this.state.tabIndex}
              onChange={(e, v) => {
                this.setPersistState({ tabIndex: v });
              }}
              aria-label="simple tabs example"
              variant="fullWidth"
            >
              <Tab
                label={
                  <Badge
                    badgeContent={this.state.notes.filter(n => n.on).length}
                    color="error"
                  >
                    Chord
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={this.state.modifiers.filter(n => n.on).length}
                    color="error"
                  >
                    Flat/Sharp
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={this.state.types.filter(n => n.on).length}
                    color="error"
                  >
                    Type
                  </Badge>
                }
              />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.tabIndex} index={0}>
            {this.renderNoteFilter()}
          </TabPanel>
          <TabPanel value={this.state.tabIndex} index={1}>
            {this.renderModifierFilter()}
          </TabPanel>
          <TabPanel value={this.state.tabIndex} index={2}>
            {this.renderTypeFilter()}
          </TabPanel>
        </Card>
        <br />
        <LinearProgress
          variant="determinate"
          value={(this.state.progress / this.state.duration) * 100}
        />
        <Card style={style.card}>
          <CardContent>
            <Display chord={this.state.chord} />
          </CardContent>
        </Card>

        <style jsx>{`
          .title {
            margin: 0;
            width: 100%;
            padding-top: 80px;
            line-height: 1.15;
            font-size: 48px;
          }
          .title,
          .description {
            text-align: center;
          }
          .controller {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 50px;
          }
          .duration-text {
            font-size: 20px;
          }
          .red {
            color: red;
            font-weight: 600;
          }
        `}</style>
      </Container>
    );
  }
}
export default Home;
