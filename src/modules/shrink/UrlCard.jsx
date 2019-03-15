import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import crc32 from 'crc/crc32';

import { 
    withStyles,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Collapse,
    IconButton,
    Typography,
    TextField,
    Button,
    InputAdornment
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Firestore from '../util/Firestore';
import urlRegex from '../util/UrlRegex';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        minWidth: 200,
        maxHeight: 600,
        //width: 800,
        //maxWidth: 1000,
        //padding: theme.spacing(2),
        textAlign: 'left',
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(2),
    },
    itemContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }
    },
    baseline: {
        alignSelf: 'baseline',
        marginLeft: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            marginLeft: 0
        }
    },
    inline: {
        display: 'inline-block',
        marginLeft: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0
        }
    },
    inlineLeft: {
        width: '30%',
        textAlign: 'left',
        marginLeft: 20,
        alignSelf: 'flex-start',
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          margin: 0,
          textAlign: 'center'
        }
    },
});

function UrlCard({classes}) {
    const [expanded, setExpanded] = useState(false);
    const [url, setUrl] = useState('');
    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if (!urlRegex.test(url)) {
            setError('Insert a valid URL');
            return;
        }

        // flush past errors
        setError('');

        if (keyword != '') {
            const query = Firestore.collection("urlMap").where(
                'shrinked', '==', keyword
            )
    
            query.get().then(querySnap => {
                if (querySnap.empty) {
                    setResult(keyword);
                } else {
                    setError('Keyword already in use');
                }
            })
            .catch(e => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(e)
                }
                setError('Something went wrong');
            });
        } else {
            setResult(crc32(url).toString(16));
        }
    }

    useEffect(() => {
        return () => {
            Firestore.collection("urlMap").doc().set({
                expanded: url,
                shrinked: result
            })
            .then(() => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log("doc written")
                }
            })
            .catch(e => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(e)
                }
                setError('Something went wrong');
            });
        }
    }, [result])

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader title="allun.ga" />
                <CardContent>
                    <div className={classes.itemContainer}>
                        <div className={classes.baseline}>
                            <div className={classes.inline}>
                                <TextField
                                    className={classes.textField}
                                    id="outlined-name"
                                    label="Enter your long URL"
                                    aria-label="Enter your long URL"
                                    margin="normal"
                                    variant="outlined"
                                    autoFocus={true}
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                />
                                { error == '' ? 
                                    <TextField
                                        className={classes.textField}
                                        id="outlined-read-only-input"
                                        //label="Shortned URL"
                                        //aria-label="Shortned URL"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={'allun.ga/' + result}
                                    /> : 
                                    <TextField
                                        error
                                        className={classes.textField}
                                        id="outlined-error"
                                        //label="Error"
                                        //aria-label="Error"
                                        margin="normal"
                                        variant="outlined"
                                        value={error}
                                    />
                                }
                            </div>
                            <div className={classes.inlineRight}>
                                <Button 
                                className={classes.button}
                                variant="contained" 
                                color="secondary" 
                                size="large"
                                onClick={e => handleSubmit(e)}
                                >
                                    <Typography variant="button">
                                        <strong>go!</strong>
                                    </Typography>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardActions 
                    className={classes.actions} 
                    disableActionSpacing
                >
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        aria-label="Show more"
                        aria-expanded={expanded}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse 
                    in={expanded} 
                    timeout="auto" 
                    unmountOnExit
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Customize your URL!
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <div className={classes.itemContainer}>
                            <div className={classes.baseline}>
                                <div className={classes.inline}>
                                    <TextField
                                        className={classes.textField}
                                        id="simple-start-adornment"
                                        label="Customize your URL!"
                                        aria-label="Customize your URL"
                                        variant="outlined"
                                        autoComplete="off"
                                        InputProps={{ startAdornment: 
                                            <InputAdornment position="start">
                                                allun.ga/
                                            </InputAdornment>,
                                        }}
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)}  
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
}

UrlCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UrlCard);
